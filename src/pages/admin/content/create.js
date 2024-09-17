import ThisImage from '@/components/atoms/ThisImage';
import Editor from '@/components/organisms/Editor';
import GalleryModal from '@/components/organisms/GalleryModal';
import LayoutAdmin from '@/components/template/LayoutAdmin';
import ProtectedRoute from '@/middleware/ProtectedRoute';
import { BreadcrumbItem, Breadcrumbs, Button, Card, Input, Textarea, useDisclosure } from '@nextui-org/react';
import { useForm } from '@tanstack/react-form';
import classNames from 'classnames';
import { ImagePlus } from 'lucide-react';
import Link from 'next/link';

import * as React from 'react';
import slugify from 'slugify';

const CreateContent = () => {
  const [isOver, setIsOver] = React.useState(false);
  const [thumbnail, setThumbnail] = React.useState();
  const [slugContent, setSlugContent] = React.useState();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const handleSelectThumbnail = (value) => {
    setThumbnail(value);
  };

  const formAdd = useForm({
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      body: '',
      status: '',
    },
    onSubmit: ({ value }) => {
      // mutationAdd.mutateAsync(value);
    },
  });

  return (
    <LayoutAdmin titlePage={'Create Content'} className={'space-y-4'}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          formAdd.handleSubmit();
        }}
        className="space-y-4"
      >
        <Card className="p-4 space-y-4">
          <Breadcrumbs>
            <BreadcrumbItem>
              <Link href={'/admin/content'}>Content</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>Create</BreadcrumbItem>
          </Breadcrumbs>
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full aspect-video bg-primary rounded-md overflow-hidden relative" onMouseOver={() => setIsOver(true)} onMouseOut={() => setIsOver(false)}>
              <div
                className={classNames(
                  'absolute z-10 bottom-0 inset-x-0 bg-primary bg-opacity-60 h-full cursor-pointer flex justify-center items-center flex-col text-white transition-all',
                  isOver ? '' : 'hidden'
                )}
                onClick={onOpen}
              >
                <ImagePlus size={40} />
                <p>Take your thumbnail</p>
              </div>
              {thumbnail && <ThisImage src={thumbnail.src} alt={thumbnail.slug} fill className={'object-cover'} />}
            </div>
            <div className="space-y-4 h-full">
              <div className="space-y-4">
                <formAdd.Field
                  name="title"
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
                          label={'Title'}
                          isInvalid={field.state.meta.errors.length && field.state.meta.isTouched}
                          errorMessage={field.state.meta.errors.join(',')}
                          value={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                            setSlugContent(slugify(e.target.value));
                          }}
                          required
                        />
                      </>
                    );
                  }}
                />
                <formAdd.Field
                  name="slug"
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
                          label={'Slug'}
                          isInvalid={field.state.meta.errors.length && field.state.meta.isTouched}
                          errorMessage={field.state.meta.errors.join(',')}
                          value={slugContent}
                          onChange={(e) => {
                            setSlugContent(slugify(e.target.value));
                            field.handleChange(slugContent);
                          }}
                          required
                        />
                      </>
                    );
                  }}
                />
                <formAdd.Field
                  name="description"
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
                        <Textarea
                          id={field.name}
                          type="text"
                          color="primary"
                          variant="bordered"
                          name={field.name}
                          label={'Description'}
                          isInvalid={field.state.meta.errors.length && field.state.meta.isTouched}
                          errorMessage={field.state.meta.errors.join(',')}
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                          className="h-full"
                        >
                          {field.state.value}
                        </Textarea>
                      </>
                    );
                  }}
                />
              </div>

              <div className="grid w-full gap-4 grid-cols-2 ">
                <Button color="primary" variant="faded">
                  Save as draft
                </Button>
                <Button color="primary">Save and publish</Button>
              </div>
            </div>
            <div></div>
          </div>
        </Card>
        <Card className="p-4">
          <formAdd.Field
            name="body"
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
                  <Editor onChange={(value) => field.handleChange(value)} />
                </>
              );
            }}
          />
        </Card>
      </form>
      <>
        <GalleryModal isOpen={isOpen} onClose={onClose} onOpen={onOpen} onOpenChange={onOpenChange} onSelect={handleSelectThumbnail} />
      </>
    </LayoutAdmin>
  );
};

export default ProtectedRoute(CreateContent);
