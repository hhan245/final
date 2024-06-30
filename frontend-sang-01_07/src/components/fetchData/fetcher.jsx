
import qs from 'qs';

export default async function fetcher(
  path,
  parameters,
  options 
) {
  const url =
    process.env.NEXT_PUBLIC_BACKEND_SERVER_MEDIA +
    `/api${path}?` +
    qs.stringify(parameters, { encodeValuesOnly: true });

  try {
    const strapiResponse = await fetch(url, options);

    if (!strapiResponse.ok) {
      // check if response in json-able
      const contentType = strapiResponse.headers.get('content-type');
      if (contentType === 'application/json; charset=utf-8') {
        const errorData = await strapiResponse.json();
        throw new Error(
          `${errorData.error.status} ${errorData.error.name}: ${errorData.error.message}`
        );
      } else {
        // If no Strapi error details, throw a generic HTTP error
        throw new Error(
          `HTTP Error: ${strapiResponse.status} - ${strapiResponse.statusText}`
        );
      }
    }

    // success
    const successData = await strapiResponse.json();
    return successData;
  } catch (error) {
    throw error;
  }
}