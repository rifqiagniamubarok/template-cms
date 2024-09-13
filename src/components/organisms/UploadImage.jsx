import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import * as React from 'react';
import ImageDropzone from '../molecules/ImageDropzone';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';

const UploadImage = ({ isOpen, onOpenChange, onClose, onSucces }) => {
  const [files, setFiles] = React.useState(null);
  const [name, setName] = React.useState('');

  const form = useForm({
    defaultValues: {
      image: null,
      name: '',
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append('images', files);
      formData.append('name', value.name);
      mutation.mutate(formData);
    },
  });

  const mutation = useMutation({
    mutationFn: (payload) => {
      return axios.post(`/api/admin/image`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: (data, variables, context) => {
      handleSuccess();
      onClose();
    },
  });

  const handleSuccess = () => {
    onSucces();
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {(onClose) => (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <ModalHeader className="flex flex-col gap-1">Upload Image</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <ImageDropzone onImageUpload={(img) => setFiles(img)} />
                  <form.Field
                    name="name"
                    validators={{
                      onChange: ({ value }) => (value.length < 5 ? 'Name must be at least 3 characters' : undefined),
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
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <>
                      <Button type="submit" isDisabled={!canSubmit || !files} color="primary" isLoading={isSubmitting}>
                        Save
                      </Button>
                    </>
                  )}
                />
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UploadImage;
