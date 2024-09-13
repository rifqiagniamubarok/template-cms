import ThisAvatar from '@/components/atoms/ThisAvatar';
import ThisAvatarSelect from '@/components/atoms/ThisAvatarSelect';
import GalleryModal from '@/components/organisms/GalleryModal';
import LayoutAdmin from '@/components/template/LayoutAdmin';
import ProtectedRoute from '@/middleware/ProtectedRoute';
import { BreadcrumbItem, Breadcrumbs, Button, Card, Input, useDisclosure } from '@nextui-org/react';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Camera } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import * as React from 'react';

const EditProfile = () => {
  const router = useRouter();

  const fetchData = async () => {
    const { data } = await axios.get('/api/admin/profile');
    return data;
  };

  const { isPending, isError, data, error } = useQuery({
    // queryKey: [page],
    queryFn: async () => fetchData(),
  });

  const form = useForm({
    defaultValues: {
      firstName: data?.data?.firstName || '',
      lastName: data?.data?.lastName || '',
      email: data?.data?.email || '',
      picture: data?.data?.picture || '',
    },
    onSubmit: ({ value }) => {
      mutation.mutateAsync(value);
    },
  });

  const handleFetchUpadte = async (payload) => {
    const data = await axios.put(`/api/admin/profile`, payload);
    const res = data.data.data;
    const signInPayload = { email: res.email, password: res.tokenTempo };
    await signIn('credentials', {
      redirect: false,
      email: signInPayload.email,
      password: signInPayload.password,
    });
    return data;
  };

  const mutation = useMutation({
    mutationFn: (payload) => {
      return handleFetchUpadte(payload);
    },
    onSuccess: (data, variables, context) => {
      const result = data.data.data;

      const payload = {
        name: result.firstName + ' ' + result.lastName,
        email: result.email,
        image: result.picture,
      };

      router.push('/admin/profile');
    },
  });

  return (
    <LayoutAdmin>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Card className={'p-8 space-y-4'}>
          <Breadcrumbs>
            <BreadcrumbItem>
              <Link href="/admin/profile">Profile</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>Edit</BreadcrumbItem>
          </Breadcrumbs>
          <div className="flex flex-col items-center gap-y-4">
            {!isPending && !isError && (
              <div className="gap-y-4 w-full flex flex-col items-center">
                <div className="flex justify-center w-full ">
                  <form.Field
                    name="picture"
                    children={(field) => (
                      <ThisAvatarSelect
                        size={120}
                        defaultSrc={field.state.value}
                        onSelect={({ src, id }) => {
                          console.log({ src });
                          field.handleChange(src);
                        }}
                      />
                    )}
                  />
                </div>
                <form.Field
                  name="firstName"
                  validators={{
                    onChange: ({ value }) => (value.length < 3 ? 'Name must be at least 5 characters' : undefined),
                    onChangeAsyncDebounceMs: 10,
                    onChangeAsync: async ({ value }) => {
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      return value.includes('error') && 'No "error" allowed in name';
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
                          className="w-2/3"
                          required
                        />
                      </>
                    );
                  }}
                />
                <form.Field
                  name="lastName"
                  validators={{
                    onChange: ({ value }) => (value.length < 3 ? 'Name must be at least 5 characters' : undefined),
                    onChangeAsyncDebounceMs: 10,
                    onChangeAsync: async ({ value }) => {
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      return value.includes('error') && 'No "error" allowed in name';
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
                          className="w-2/3"
                          required
                        />
                      </>
                    );
                  }}
                />
                <form.Field
                  name="email"
                  validators={{
                    onChange: ({ value }) => (value.length < 3 ? 'Name must be at least 5 characters' : undefined),
                    onChangeAsyncDebounceMs: 10,
                    onChangeAsync: async ({ value }) => {
                      await new Promise((resolve) => setTimeout(resolve, 1000));
                      return value.includes('error') && 'No "error" allowed in name';
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
                          className="w-2/3"
                          required
                        />
                      </>
                    );
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <Link href="/admin/profile">
              <Button color="danger" variant="light">
                Cancel
              </Button>
            </Link>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <>
                  <Button type="submit" isDisabled={!canSubmit} color="primary" isLoading={isSubmitting}>
                    Save
                  </Button>
                </>
              )}
            />
          </div>
        </Card>
      </form>
    </LayoutAdmin>
  );
};

export default ProtectedRoute(EditProfile);
