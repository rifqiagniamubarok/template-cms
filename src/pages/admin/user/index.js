import ThisAvatar from '@/components/atoms/ThisAvatar';
import ThisAvatarSelect from '@/components/atoms/ThisAvatarSelect';
import LayoutAdmin from '@/components/template/LayoutAdmin';
import ProtectedRoute from '@/middleware/ProtectedRoute';
import {
  Button,
  Card,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@nextui-org/react';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Avvvatars from 'avvvatars-react';
import axios from 'axios';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import * as React from 'react';

const UserPage = () => {
  const queryClient = useQueryClient();
  const {
    data: { user },
  } = useSession();

  const [page, setPage] = React.useState(1);
  const { isOpen: isOpenAdd, onOpen: onOpenAdd, onOpenChange: onOpenChangeAdd, onClose: onCloseAdd } = useDisclosure();

  const fetchData = async (params) => {
    params.pageSize = 10;
    const { data } = await axios.get('/api/admin/user', { params });
    return data;
  };

  const formAdd = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      picture: null,
      password: '',
    },
    onSubmit: ({ value }) => {
      mutationAdd.mutateAsync(value);
    },
  });

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['user', page],
    queryFn: async () => fetchData({ page }),
  });

  const mutationAdd = useMutation({
    mutationFn: (payload) => {
      return axios.post(`/api/admin/user`, payload);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries();
      onCloseAdd();
      formAdd.reset();
    },
    onError: (error, variables, context) => {
      console.log({ context, error, variables });
      // queryClient.invalidateQueries();
    },
  });

  const handleChangePage = (num) => {
    queryClient.invalidateQueries();
    setPage(num);
  };

  return (
    <LayoutAdmin>
      <Card className="p-4 space-y-4">
        <div className="flex justify-end">
          <Button color="primary" onClick={() => onOpenAdd()}>
            <Plus size={20} /> Create
          </Button>
        </div>
        <Table aria-label="Example static collection table" removeWrapper={true} isLoading={isPending}>
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn></TableColumn>
          </TableHeader>
          <TableBody isLoading={isPending}>
            {data?.data.map(({ id, picture, firstName, lastName, email }, index) => (
              <TableRow key={id}>
                <TableCell className="flex items-center gap-2">
                  <ThisAvatar src={picture} value={firstName + ' ' + lastName} isProfile={false} /> {firstName} {lastName}
                </TableCell>
                <TableCell>{email}</TableCell>
                <TableCell className="space-x-1">
                  {email !== user.email && (
                    <>
                      <Button isIconOnly variant="faded" color="warning" size="sm">
                        <Edit2 size="15" />
                      </Button>
                      <Button isIconOnly variant="faded" color="danger" size="sm">
                        <Trash2 size="15" />
                      </Button>
                    </>
                  )}
                  {email === user.email && (
                    <>
                      <Link href="/admin/profile">
                        <Button size="sm" variant="faded" color="primary">
                          Profile
                        </Button>
                      </Link>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-center">
          {data?.pagination?.totalPages > 1 && <Pagination initialPage={1} page={page} showControls total={data.pagination.totalPages} onChange={handleChangePage} />}
        </div>
      </Card>
      <>
        <Modal isOpen={isOpenAdd} onOpenChange={onOpenChangeAdd} isDismissable={false} isKeyboardDismissDisabled={true}>
          <ModalContent>
            {(onClose) => (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    formAdd.handleSubmit();
                  }}
                  className="space-y-4"
                >
                  <ModalHeader className="flex flex-col gap-1">Add user</ModalHeader>
                  <ModalBody>
                    <div className="flex justify-center w-full ">
                      <formAdd.Field
                        name="picture"
                        children={(field) => (
                          <ThisAvatarSelect
                            size={120}
                            defaultSrc={field.state.value}
                            onSelect={({ src, id }) => {
                              field.handleChange(src);
                            }}
                          />
                        )}
                      />
                    </div>
                    <formAdd.Field
                      name="firstName"
                      validators={{
                        onChange: ({ value }) => (value.length < 3 ? 'First name must be at least 3 characters' : undefined),
                        onChangeAsync: async ({ value }) => {
                          await new Promise((resolve) => setTimeout(resolve, 200));
                          return value.includes('error') && 'No "error" allowed in first name';
                        },
                      }}
                      children={(field) => {
                        return (
                          <>
                            <Input
                              id={field.name}
                              type="text"
                              color="primary"
                              variant="bordered"
                              name={field.name}
                              label={'First Name'}
                              isInvalid={field.state.meta.errors.length && field.state.meta.isTouched}
                              errorMessage={field.state.meta.errors.join(',')}
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              required
                            />
                          </>
                        );
                      }}
                    />
                    <formAdd.Field
                      name="lastName"
                      validators={{
                        onChange: ({ value }) => (value.length < 3 ? 'Last name must be at least 3 characters' : undefined),
                        onChangeAsync: async ({ value }) => {
                          await new Promise((resolve) => setTimeout(resolve, 200));
                          return value.includes('error') && 'No "error" allowed in last name';
                        },
                      }}
                      children={(field) => {
                        return (
                          <>
                            <Input
                              id={field.name}
                              type="text"
                              color="primary"
                              variant="bordered"
                              name={field.name}
                              label={'Last Name'}
                              isInvalid={field.state.meta.errors.length && field.state.meta.isTouched}
                              errorMessage={field.state.meta.errors.join(',')}
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              required
                            />
                          </>
                        );
                      }}
                    />
                    <formAdd.Field
                      name="email"
                      validators={{
                        onChange: ({ value }) => (value.length < 3 ? 'Email must be at least 3 characters' : undefined),
                        onChangeAsync: async ({ value }) => {
                          await new Promise((resolve) => setTimeout(resolve, 200));
                          return value.includes('error') && 'No "error" allowed in email';
                        },
                      }}
                      children={(field) => {
                        return (
                          <>
                            <Input
                              id={field.name}
                              type="email"
                              color="primary"
                              variant="bordered"
                              name={field.name}
                              label={'Email'}
                              isInvalid={field.state.meta.errors.length && field.state.meta.isTouched}
                              errorMessage={field.state.meta.errors.join(',')}
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              required
                            />
                          </>
                        );
                      }}
                    />
                    <formAdd.Field
                      name="password"
                      validators={{
                        onChange: ({ value }) => (value.length < 3 ? 'Password must be at least 3 characters' : undefined),
                        onChangeAsync: async ({ value }) => {
                          await new Promise((resolve) => setTimeout(resolve, 200));
                          return value.includes('error') && 'No "error" allowed in password';
                        },
                      }}
                      children={(field) => {
                        return (
                          <>
                            <Input
                              id={field.name}
                              type="password"
                              color="primary"
                              variant="bordered"
                              name={field.name}
                              label={'Password'}
                              isInvalid={field.state.meta.errors.length && field.state.meta.isTouched}
                              errorMessage={field.state.meta.errors.join(',')}
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              required
                            />
                          </>
                        );
                      }}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Cancel
                    </Button>
                    <formAdd.Subscribe
                      selector={(state) => {
                        return [state.canSubmit, state.isSubmitting];
                      }}
                      children={([canSubmit, isSubmitting]) => (
                        <>
                          <Button type="submit" color="primary" isDisabled={!canSubmit} isLoading={isSubmitting} onClick={() => {}}>
                            Save
                          </Button>
                        </>
                      )}
                    />
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    </LayoutAdmin>
  );
};

export default ProtectedRoute(UserPage);
