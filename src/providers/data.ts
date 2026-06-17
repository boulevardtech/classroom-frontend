import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
import { API_URL } from "./constants";
import { mockSubjects } from "./mock-data";
import { BaseRecord, CrudFilter, DataProvider } from "@refinedev/core";

const simpleRestDataProvider = createSimpleRestDataProvider({
  apiURL: API_URL,
});

// Create a mock data provider wrapper
const mockDataProvider: DataProvider = {
  ...simpleRestDataProvider,
  getList: async ({ resource, filters, pagination, sorters, meta }) => {
    if (resource === "subjects") {
      let filteredSubjects = [...mockSubjects];

      // Apply filters
      if (filters) {
        filters.forEach((filter: CrudFilter) => {
          if (filter.field && filter.value) {
            if (filter.operator === "eq") {
              filteredSubjects = filteredSubjects.filter(
                (subject: any) => subject[filter.field] === filter.value
              );
            } else if (filter.operator === "contains") {
              filteredSubjects = filteredSubjects.filter(
                (subject: any) =>
                  subject[filter.field]
                    ?.toString()
                    .toLowerCase()
                    .includes((filter.value as string).toLowerCase())
              );
            }
          }
        });
      }

      // Apply sorters
      if (sorters) {
        sorters.forEach((sorter: any) => {
          filteredSubjects.sort((a: any, b: any) => {
            const aValue = a[sorter.field];
            const bValue = b[sorter.field];
            return sorter.order === "asc"
              ? aValue > bValue
                ? 1
                : -1
              : bValue > aValue
              ? 1
              : -1;
          });
        });
      }

      // Apply pagination
      const pageSize = pagination?.pageSize || 10;
      const pageIndex = (pagination?.current || 1) - 1;
      const startIndex = pageIndex * pageSize;
      const endIndex = startIndex + pageSize;

      const paginatedSubjects = filteredSubjects.slice(startIndex, endIndex);

      return Promise.resolve({
        data: paginatedSubjects,
        total: filteredSubjects.length,
      });
    }

    // For other resources, use the simple REST provider
    return simpleRestDataProvider.getList?.({
      resource,
      filters,
      pagination,
      sorters,
      meta,
    }) as Promise<any>;
  },

  getOne: async ({ resource, id, meta }) => {
    if (resource === "subjects") {
      const subject = mockSubjects.find((s) => s.id === Number(id));
      if (subject) {
        return Promise.resolve({ data: subject });
      }
      return Promise.reject(new Error("Subject not found"));
    }

    return simpleRestDataProvider.getOne?.({
      resource,
      id,
      meta,
    }) as Promise<any>;
  },

  create: async ({ resource, values, meta }) => {
    if (resource === "subjects") {
      const newSubject = {
        ...values,
        id: Math.max(...mockSubjects.map((s) => s.id)) + 1,
        createdAt: new Date().toISOString(),
      };
      mockSubjects.push(newSubject);
      return Promise.resolve({ data: newSubject });
    }

    return simpleRestDataProvider.create?.({
      resource,
      values,
      meta,
    }) as Promise<any>;
  },

  update: async ({ resource, id, values, meta }) => {
    if (resource === "subjects") {
      const index = mockSubjects.findIndex((s) => s.id === Number(id));
      if (index !== -1) {
        mockSubjects[index] = { ...mockSubjects[index], ...values };
        return Promise.resolve({ data: mockSubjects[index] });
      }
      return Promise.reject(new Error("Subject not found"));
    }

    return simpleRestDataProvider.update?.({
      resource,
      id,
      values,
      meta,
    }) as Promise<any>;
  },

  deleteOne: async ({ resource, id, meta }) => {
    if (resource === "subjects") {
      const index = mockSubjects.findIndex((s) => s.id === Number(id));
      if (index !== -1) {
        const deletedSubject = mockSubjects[index];
        mockSubjects.splice(index, 1);
        return Promise.resolve({ data: deletedSubject });
      }
      return Promise.reject(new Error("Subject not found"));
    }

    return simpleRestDataProvider.deleteOne?.({
      resource,
      id,
      meta,
    }) as Promise<any>;
  },
};

export const { dataProvider: simpleDataProvider, kyInstance } =
  simpleRestDataProvider;
export const dataProvider = mockDataProvider;
