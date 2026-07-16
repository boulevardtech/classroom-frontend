import {createDataProvider,CreateDataProviderOptions} from "@refinedev/rest";
import {BACKEND_BASE_URL} from "@/constants";
import {ListResponse} from "@/types";
const options: CreateDataProviderOptions = {
  getList:{
    getEndpoint:({resource}) => resource,
    buildQueryParams: async({resource,pagination,filters})=>{
      const page = pagination?.currentPage??1;
      const pageSize = pagination?.pageSize?? 10;
     // const params = {page,limit:pageSize};
      const params:Record<string,string|number> = {page,limit:pageSize};
      filters?.forEach((filter)=>{
        const field = 'field' in filter ? filter.field:'';
        const value = String(filter.value);
        if(resource=== 'subjects'){
          if(field=== 'department')params.department = value;
          if(field=== 'name'|| field=== 'code')params.search = value;

        }
      })
      return params;
    },
    mapResponse: async(response)=>{
      const payload: ListResponse = await response.clone().json();

      return payload.data ?? [];
    },
    getTotalCount: async (response)=>{
      const payload: ListResponse = await response.clone().json();
      return payload.pagination?.total ?? payload.data ?.length ?? 0;
    }

  }

}

const {dataProvider: baseDataProvider} = createDataProvider(BACKEND_BASE_URL, options);

export const dataProvider = {
  ...baseDataProvider,
  getList: async ({ resource, pagination, filters, sorters, meta }: any) => {
    const url = new URL(`${BACKEND_BASE_URL}/${resource}`);

    if (pagination) {
      url.searchParams.append("page", (pagination.current ?? 1).toString());
      url.searchParams.append("limit", (pagination.pageSize ?? 10).toString());
    }

    if (filters) {
      filters.forEach((filter: any) => {
        if (filter.field === "name" && filter.operator === "contains") {
          url.searchParams.append("search", filter.value);
        }
        if (filter.field === "department" && filter.operator === "eq") {
          url.searchParams.append("department", filter.value);
        }
      });
    }

    const response = await fetch(url.toString()).catch((error) => {
      throw {
        message: error.message,
        statusCode: undefined,
      };
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.message || errorData.error || "Fetch error",
        statusCode: response.status,
      };
    }

    return {
      data: await options.getList!.mapResponse!(response),
      total: await options.getList!.getTotalCount!(response),
    };
  },
};