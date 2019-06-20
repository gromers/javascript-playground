const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

function generateBasicAuthorization() {
  const auth = Buffer.from(`${process.env.API_USER}:${process.env.API_KEY}`);
  return `Basic ${auth.toString('base64')}`;
}

async function getCurrentTimeEntry() {
  const currentRunningEntry = await axios.get('https://www.toggl.com/api/v8/time_entries/current', {
    headers: {
      Authorization: generateBasicAuthorization(),
    },
  });
  return currentRunningEntry.data;
}

async function stopTimeEntry(entryId) {
  try {
    console.log(`Current running time entry id = ${entryId}`);
    const stopped = await axios.put(`https://www.toggl.com/api/v8/time_entries/${entryId}/stop`, {}, {
      headers: {
        Authorization: generateBasicAuthorization(),
      },
    });
    return stopped.data;
  } catch (err) {
    console.log(err);
  }
  return undefined;
}

async function stop() {
  const activeTimeEntry = await getCurrentTimeEntry();
  console.log(activeTimeEntry.data);

  if (activeTimeEntry.data) {
    const stoppedEntry = await stopTimeEntry(activeTimeEntry.data.id);
    console.log(stoppedEntry.data);
  } else {
    console.log('No entry was running');
  }
}

try {
  stop();
} catch (err) {
  console.log(err);
}
