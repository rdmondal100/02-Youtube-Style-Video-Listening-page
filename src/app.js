

document.addEventListener('DOMContentLoaded', async() => {

    const API_URL = 'https://api.freeapi.app/api/v1/public/youtube/videos?page=1&limit=50'
    const avatarImage = 'https://yt3.googleusercontent.com/arHIKjc6JTqF_b4QJKPHhQC_Jr8q0XfI7LEpJ0-VuiI0ZRz9xFNz94TWl4CLOcozLx-iAhV_=s160-c-k-c0x00ffffff-no-rj'
    let videosData = [];

    

    // fetch video from api 
    const fetchVideosFromApi = async () => {
        try {
            const response = await axios.get(API_URL)

            if(response?.statusText ==="OK"){
                // extract the videos from api response data 
                videosData = response?.data?.data?.data
            }
        } catch (error) {
            console.error('Failed to fetch videos:', error);
            const gridContainer = document.getElementById('videosGrid');
            gridContainer.innerHTML = '<p class="error">Unable to load videos. Please try again later.</p>';
        }
    }

    await fetchVideosFromApi()

    //create video card for each video 
    const createVideoCard = (video) => {
        
        if(video?.items?.id){
            const videoCardElement = document.createElement("div")
            const hrefLink = `https://www.youtube.com/watch?v=${video?.items?.id}`
            videoCardElement.classList.add('videoCardWrapper')
            videoCardElement.innerHTML = `
                <a class="videoCard" id=${video?.items?.id} href=${hrefLink}>
                    <img class="thumbnail-img" src="${video?.items?.snippet?.thumbnails?.standard?.url}" alt="Video Title">
                    <div class="videoInfo">
                        <img class="channelAvatar" src='${avatarImage}' alt="Channel Name">
                        <div class="videoText">
                        <p class="videoTitle">${video?.items?.snippet?.title}</p>
                        <p class="channelName">${video?.items?.snippet?.channelTitle}</p>
                        
                        </div>
                    </div>
                    </a>
            `
            return videoCardElement
        }

    }

    //rendr the video card on the ui
    const renderVideosOnTheUi = (videosDataArray=[])=>{
        const videosGridElement = document.getElementById("videosGrid")
        if(videosDataArray.length){
            videosGridElement.innerHTML = ''
            videosDataArray.map((video)=>{
                if(videosGridElement){
                    const videoCardElement = createVideoCard(video)
                    if(videoCardElement){
                        videosGridElement.appendChild(videoCardElement)
                    }
                }
            })
        }else{
            // if  no video is there show the message
            videosGridElement.innerHTML = ''
            const noVideosFoundMessage = document.createElement("div")
            noVideosFoundMessage.classList.add("no-search-result")
            noVideosFoundMessage.innerHTML = `
            <div class="no-result">No results found</div>
<div class="try-diff-keyword">Try different keywords or remove search filters </div>
            `
            if(videosGridElement && noVideosFoundMessage){
                videosGridElement.appendChild(noVideosFoundMessage)
            }
        }
    }

    renderVideosOnTheUi(videosData)
    
    //seach video by search query
    const searchInput = document.getElementById("videoSearch");
    searchInput.addEventListener("input", (event) => {
        if(searchInput){
            const searchQuery = event.target.value.toLowerCase();
            const filteredVideos = videosData.filter((video) =>
    video?.items?.snippet?.title.toLowerCase().includes(searchQuery)
            );
            renderVideosOnTheUi(filteredVideos);
        }
    });


})