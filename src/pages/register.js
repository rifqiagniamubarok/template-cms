import axios from 'axios';
import { useRouter } from 'next/router';
import { Button, Card, Input } from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import Link from 'next/link';

const ErrorMsg = ({ error }) => {
  let msg = 'Opps, something error';
  if (error?.response?.data?.errors[0]?.message) {
    msg = error.response.data.errors[0].message;
  }
  return <div className="text-sm text-red-600 border-2 border-red-500 p-2 rounded-md text-center bg-red-50">{msg}!</div>;
};

const Register = () => {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value);
    },
  });

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (payload) => {
      return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, payload);
    },
    onSuccess: (data, variables, context) => {
      router.push('/login');
    },
  });

  return (
    <div className="h-screen w-screen bg-white flex justify-center items-center">
      <Card className="border border-primary px-8 py-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className=" space-y-4 min-w-80 "
        >
          <p className="text-xl">Register</p>
          {mutation.isError && <ErrorMsg error={mutation.error} />}
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => (value.length < 5 ? 'Name must be at least 5 characters' : undefined),
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
                      name={field.name}
                      label={field.name}
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
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => (value.length < 5 ? 'Email must be at least 5 characters' : undefined),
                onChangeAsyncDebounceMs: 10,
                onChangeAsync: async ({ value }) => {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  return value.includes('error') && 'No "error" allowed in email';
                },
              }}
              children={(field) => {
                return (
                  <>
                    <Input
                      id={field.name}
                      type="text"
                      name={field.name}
                      label={field.name}
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
          </div>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <form.Field
              name="password"
              validators={{
                onChange: ({ value }) => (value.length < 5 ? 'Password must be at least 5 characters' : undefined),
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: async ({ value }) => {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  return value.includes('error') && 'No "error" allowed in password';
                },
              }}
              children={(field) => {
                return (
                  <>
                    <Input
                      id={field.name}
                      type="password"
                      name={field.name}
                      label={field.name}
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
          </div>

          <div className="space-x-4">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <>
                  <Button type="submit" isDisabled={!canSubmit} color="primary" isLoading={isSubmitting}>
                    Register
                  </Button>
                </>
              )}
            />
            <Link href={'/login'}>login</Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Register;
