import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { PaginatedResponse } from "../models/pagination";

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.defaults.baseURL = "http://localhost:5138/api/";
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(
  async (response) => {
    await sleep();
    const pagination = response.headers["pagination"];
    if (pagination) {
      response.data = new PaginatedResponse(
        response.data,
        JSON.parse(pagination)
      );
      return response;
    }
    return response;
  },
  (error: AxiosError) => {
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
      case 400:
        if (data.errors) {
          const modelStateErrors: string[] = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(data.erros[key]);
            }
          }
          throw modelStateErrors.flat();
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.title);
        break;
      case 500:
        router.navigate("/server-error", { state: { error: data } });
        break;
      default:
        break;
    }
    return Promise.reject(error.response);
  }
);

const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params }).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
  put: (url: string, body: object) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
};

const Catalog = {
  list: (params: URLSearchParams) => requests.get("products", params),
  details: (id: number) => requests.get(`products/${id}`),
  fetchFilters: () => requests.get("products/filters"),
};

const TestErrors = {
  get400Error: () => requests.get("buggy/bad-request"),
  get401Error: () => requests.get("buggy/unauthorised"),
  get404Error: () => requests.get("buggy/not-found"),
  get500Error: () => requests.get("buggy/server-error"),
  getValidationError: () => requests.get("buggy/validation-error"),
};

const Basket = {
  get: () => requests.get("basket"),
  addItem: (productId: number, quantity = 1) =>
    requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
  removeItem: (productId: number, quantity = 1) =>
    requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
};

const agent = {
  Catalog,
  TestErrors,
  Basket,
};

export default agent;
