import ThisAvatar from '@/components/atoms/ThisAvatar';
import LayoutAdmin from '@/components/template/LayoutAdmin';
import ProtectedRoute from '@/middleware/ProtectedRoute';
import { BreadcrumbItem, Breadcrumbs, Card, Input } from '@nextui-org/react';
import { useForm } from '@tanstack/react-form';
import Link from 'next/link';
import React from 'react';

const CreateUser = () => {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      picture: '',
      password: '',
    },
    onSubmit: ({ value }) => {
      // mutation.mutateAsync(value);
      //   console.log({ value });
    },
  });
  return (
    <LayoutAdmin titlePage={'Create User'}>
      <Card className="p-4 space-y-4">
        <Breadcrumbs>
          <BreadcrumbItem>
            <Link href={'/admin/user'}>User</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>Create</BreadcrumbItem>
        </Breadcrumbs>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4 w-1/2"
          >
            <ThisAvatar size={200} />
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
                      required
                    />
                  </>
                );
              }}
            />
            <form.Field
              name="password"
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
          </form>
        </div>
      </Card>
    </LayoutAdmin>
  );
};

export default ProtectedRoute(CreateUser);
