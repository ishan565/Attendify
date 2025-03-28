// import { Client, Account, Databases, ID } from 'appwrite';

// const client = new Client();

// client
//   .setEndpoint('https://cloud.appwrite.io/v1') // ✅ Your Appwrite endpoint
//   .setProject('67dd0e8100003d3f4c43'); // ✅ Your project ID

// const account = new Account(client);
// const databases = new Databases(client);

// export { client, account, databases, ID };

// src/appwrite/appwriteConfig.js
import { Client, Databases, Account } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // ✅ Replace with your endpoint if self-hosted
  .setProject("67dd0e8100003d3f4c43"); // ✅ Replace with your actual Project ID

const databases = new Databases(client);
const account = new Account(client);

export { client, databases, account };
