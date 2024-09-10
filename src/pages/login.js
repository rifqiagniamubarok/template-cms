import PassedRoute from '@/middleware/PassedRoute';
import { Button, Card, Input } from '@nextui-org/react';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: ({ value }) => {
      mutation.mutateAsync({
        email: value.email,
        password: value.password,
      });
    },
  });

  const handleFetch = async ({ email, password }) => {
    const { ok, error } = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (error) {
      throw error;
    }
    return { data: { ok } };
  };

  const mutation = useMutation({
    mutationFn: (payload) => {
      return handleFetch(payload);
    },
    onSuccess: () => {
      router.push('/');
    },
    onError: (error, variables, context) => {
      if (error) {
        console.error({ error, variables, context });
      }
    },
  });

  return (
    <div className="h-screen w-screen bg-white flex justify-center items-center">
      <Card className="border border-primary  px-8 py-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className=" space-y-4 min-w-80 "
        >
          <p className="text-xl">Login</p>
          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => (value.length < 5 ? 'Email must be at least 5 characters' : undefined),
                onChangeAsyncDebounceMs: 500,
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
                  return value.includes('error') && 'No "error" allowed in first name';
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
          {mutation.isError && <p className="text-red">{mutation.error}</p>}
          <div>
            <div className="space-x-4">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <>
                    <Button type="submit" isDisabled={!canSubmit} color="primary" isLoading={isSubmitting || mutation.isPending}>
                      Login
                    </Button>
                  </>
                )}
              />
              <Link href={'/register'}>register</Link>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default PassedRoute(Login);
