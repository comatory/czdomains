export function sendSubmission({
  domain,
  email,
}: {
  domain: string;
  email: string;
}): Promise<true> {
  return new Promise((resolve, reject) => {
    const url = process.env.FORM_SUBMISSION_ACTION_URL;

    if (!url) {
      reject(new Error('Submission endpoint not configured.'));
      return;
    }

    const data = new FormData();
    data.append('domain', domain);
    data.append('email', email);

    console.log(
      `Submitting form to ${url} with domain: ${data.get(
        'domain',
      )}, email: ${data.get('email')}`,
    );

    fetch(url, {
      method: 'POST',
      body: data,
    })
      .then((response) => {
        console.log('Response status:', response.status);

        if (response.status !== 200) {
          const err = new Error('Submission failed.');
          console.error(err);
          reject(err);
          return;
        }

        resolve(true);
      })
      .catch(reject);
  });
}
