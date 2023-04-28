import { useEffect, useState } from "react";

const CLIENT_ID = "170541822604368";
const CLIENT_SECRET = "53540cc4b576e380a92fe3e169791b8e";
const REDIRECT_URI = "http://localhost:3030/manage/account/TST4301/upload";

export default function InstagramUpload() {
  const [authCode, setAuthCode] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (authCode) {
      const tokenUrl = `https://api.instagram.com/oauth/access_token`;
      const formData = new FormData();
      formData.append("client_id", CLIENT_ID);
      formData.append("client_secret", CLIENT_SECRET);
      formData.append("grant_type", "authorization_code");
      formData.append("redirect_uri", REDIRECT_URI);
      formData.append("code", authCode);

      fetch(tokenUrl, {
        method: "POST",
        body: formData,
      })
        .then(response => response.json())
        .then(data => setAccessToken(data.access_token))
        .catch(error => console.error(error));
    }
  }, [authCode]);

  const handleLogin = () => {
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = authUrl;
  };

  return (
    <div>
      {!accessToken ? (
        <button onClick={handleLogin}>Log in with Instagram</button>
      ) : (
        <p>Access token: {accessToken}</p>
      )}
    </div>
  );
}
