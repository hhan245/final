
import fetcher from './fetcher';

export async function getCurrentUser(token) {
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { tags: ['strapi-users-me'] },
  };
  const user = await fetcher('/users/me', {}, options);
  return user;
}