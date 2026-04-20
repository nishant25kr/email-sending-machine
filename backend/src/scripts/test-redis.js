import IORedis from "ioredis";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../.env") });

const REDIS_URL = process.env.REDIS_URL;

async function testConnection() {
  if (!REDIS_URL) {
    console.error("❌ Error: REDIS_URL not found in .env file");
    process.exit(1);
  }

  console.log(`🔍 Testing connection to: ${REDIS_URL.split('@')[1]} (password hidden)`);
  
  const redis = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: 1,
    retryStrategy: () => null // Don't retry
  });

  try {
    await redis.ping();
    console.log("✅ Success! Connection to Redis is working.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Redis Connection Failed!");
    console.error(`Reason: ${err.message}`);
    
    if (err.message.includes("WRONGPASS")) {
      console.log("\n💡 Suggestion: The password in your REDIS_URL is incorrect. Please check your Redis Cloud console for the correct password.");
    } else if (err.message.includes("ECONNREFUSED")) {
      console.log("\n💡 Suggestion: The Redis server is unreachable. Check the host and port.");
    }
    
    process.exit(1);
  }
}

testConnection();
