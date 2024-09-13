import LayoutAdmin from '@/components/template/LayoutAdmin';
import ProtectedRoute from '@/middleware/ProtectedRoute';
import { Card, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import React from 'react';

const GetContent = () => {
  return (
    <LayoutAdmin>
      <Card className="p-4">
        <Table removeWrapper>
          <TableHeader>
            <TableColumn>Title</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>STATUS</TableColumn>
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
