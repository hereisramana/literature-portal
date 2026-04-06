export function useCloudSync() {
  const login = () => {
    alert("Login with Google / OneDrive (to be implemented)");
  };

  const sync = (data) => {
    console.log("Syncing to cloud...", data);
  };

  return { login, sync };
}
