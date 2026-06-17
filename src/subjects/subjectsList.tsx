import { CreateButton } from '@/components/refine-ui/buttons/create';
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { ListView } from '@/components/refine-ui/views/list-view'
import { DataTable } from '@/components/refine-ui/data-table/data-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DEPARTMENT_OPTIONS } from '@/constants';
import { Search } from 'lucide-react'
import { useTable } from '@refinedev/react-table';
import { CrudFilter } from '@refinedev/core';
import React, { useMemo, useState } from 'react'
import { Subjects } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

//import { useState } from 'react';

function SubjectsList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment,setSelectedDepartment]= useState('all');
  const departmentFilters: CrudFilter[] = selectedDepartment === 'all' ? [] : [
    { field: 'department', operator: 'eq' as const, value: selectedDepartment }
  ];
  const searchFilters: CrudFilter[] = searchQuery ? [
    { field: 'name', operator: 'contains' as const, value: searchQuery }
  ] : [];
 // const filters = [...departmentFilters, ...searchFilters];
  const columns = useMemo<ColumnDef<Subjects>[]>(
    () => [
      {
        id: 'code',
        accessorKey: 'code',
        size: 100,
        header: () => <p className='column-title ml-2'>code</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
      },
      {
        id:  'name',
        accessorKey: 'name',
        size: 200,
        header: () => <p className='column-title ml-2'>Name</p>,
        cell: ({ getValue }) => <span className='text-foreground'>{getValue<string>()}</span>,
        filterFn: 'includesString'
      },
      {
        id: 'department',
        accessorKey: 'department',
        size: 150,
        header: () => <p className='column-title ml-2'>Department</p>,
        cell: ({ getValue }) => <Badge variant="secondary">{getValue<string>()}</Badge>,
      },{
        id: 'description',
        accessorKey: 'description',
        size: 300,
        header: () => <p className='column-title ml-2'>Description</p>,
        cell: ({ getValue }) => <span className='truncate line-clamp-2'>{getValue<string>()}</span>,
      }
    ],
    []
  );

  const subjectTable = useTable<Subjects>({
    columns,
    refineCoreProps: {
      resource: 'subjects',
      pagination: { pageSize: 10, mode: 'server' },
      filters: {
        permanent: [...departmentFilters, ...searchFilters] as CrudFilter[],
      },
        
      sorters: {
        initial: [
           {field: 'id', order: 'desc'},
        ]
      },
    }
  });
  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Subjects</h1>
      <div className='intro-row'>
        <p>Quick access to essential metrics and management tools.</p>
        <div className='actions-row'>
          <div className='search-field'>
            <Search className='search-icon'/>
            
            <input
             type='text'
             placeholder='search by name...'
             className='pl-10 w-full'
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="filter by department"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Departments
                </SelectItem>
                {DEPARTMENT_OPTIONS.map(department => (
                  <SelectItem key={department.value} value={department.value}>
                    {department.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <CreateButton />
          </div>

        </div>
      </div>
      <DataTable table={subjectTable} />
    </ListView>
  )
}

export default SubjectsList