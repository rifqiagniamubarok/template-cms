import LayoutAdmin from '@/components/template/LayoutAdmin';
import ProtectedRoute from '@/middleware/ProtectedRoute';
import { Button, Card, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const GetContent = () => {
  return (
    <LayoutAdmin>
      <Card className="p-4 space-y-4">
        <div className="flex justify-end">
          <Link href={'/admin/content/create'}>
            <Button color="primary">
              <Plus size={16} />
              Create
            </Button>
          </Link>
        </div>
        <Table removeWrapper>
          <TableHeader>
            <TableColumn>Title</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Created At</TableColumn>
          </TableHeader>
          <TableBody>
            {[...Array(10)].map((_, item) => (
              <TableRow key={item}>
                <TableCell>Tony Reichert</TableCell>
                <TableCell>CEO</TableCell>
                <TableCell>Active</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </LayoutAdmin>
  );
};

export default ProtectedRoute(GetContent);
