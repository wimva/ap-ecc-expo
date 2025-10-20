import mutation from './_mutation';
import useSWRMutation from 'swr/mutation'
import { API_URL } from '@/constants/Api'

export default function useUserLogin () {
  const { trigger, data, error, isMutating } = useSWRMutation(`${API_URL}/users/login`, (url, { arg }: { arg: any }) => {
    return mutation(url, {
      method: 'POST',
      body: arg,
    });
  });
 
  return {
    data,
    isMutating,
    isError: error,
    trigger
  }
}