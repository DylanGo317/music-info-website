// Authorization code
const generateRandomString = (length) => {
    const possible = 'QwMLGUV0hZGO7vGM3vqzb25IQTbfH6gbKQxMhMFze0k';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  }
  
  const codeVerifier  = generateRandomString(64);
  
  const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
  }
  
  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
  
  async function redirectToSpotifyAuthorize() {
    const clientId = '6fc5eda025b8463ea9bd776424fec51d'
    const redirectUri = 'http://localhost:3001';
  
    const scope = 'user-read-private user-read-email';
    const authUrl = new URL("https://accounts.spotify.com/authorize")
  
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed);
  
    window.sessionStorage.setItem('code_verifier', codeVerifier);
  
    const params =  {
      response_type: 'code',
      client_id: clientId,
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
    }
    
    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
  
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');
    
    // If user does not accept request or error occurs
    let error = urlParams.get('error');
    let state = urlParams.get('state');
  }

const SpotifyAuthorization = () => {
    let message = "Welcome!"
    if (sessionStorage.getItem('access_token') === null) {
        message = "Login to spotify to use the app";
    }
    return (
        <div>
            <p>{message}</p>
            <button onClick={redirectToSpotifyAuthorize}>Spotify Login</button>
        </div>
    )
}

export default SpotifyAuthorization