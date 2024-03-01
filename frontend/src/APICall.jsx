async function fetchTopTracks() {
    const token = sessionStorage.getItem("access_token");

    if (token == null) {
        console.log("token not found");
        return;
    }

    const time_range = "long_term"
    const limit = 50;
    const offset = 10;

    const queryParams = new URLSearchParams();
    queryParams.append("time_range", time_range);
    queryParams.append("limit", limit);
    queryParams.append("offset", offset);

    const requestURL = "https://api.spotify.com/v1/me/top/tracks";
    const tokenString = "Bearer " + token;

    console.log(requestURL);

    const result = fetch(requestURL, {
        method: "GET", headers: { Authorization: tokenString }
    })

    console.log(result);
    return;
}

const APICall = () => {
    return (
        <div>
            <button onClick={fetchTopTracks}>Fetch Top Tracks</button>
        </div>
    )
}

export default APICall