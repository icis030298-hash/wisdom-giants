import axios from "axios";

async function checkTime() {
  try {
    const start = Date.now();
    const res = await fetch("https://www.google.com", { method: "HEAD" });
    const dateStr = res.headers.get("date");
    if (!dateStr) {
      console.log("No Date header found in response");
      return;
    }
    const serverTime = new Date(dateStr).getTime();
    const localTime = Date.now();
    const diff = localTime - serverTime;
    console.log("Server time (Google):", new Date(serverTime).toISOString());
    console.log("Local system time :", new Date(localTime).toISOString());
    console.log("Time difference (ms):", diff);
    console.log("Time difference (seconds):", diff / 1000);
    if (Math.abs(diff) > 300000) {
      console.warn("WARNING: System clock is out of sync by more than 5 minutes!");
    } else {
      console.log("System clock is in sync (within 5 minutes).");
    }
  } catch (e) {
    console.error("Failed to check time:", e);
  }
}

checkTime();
