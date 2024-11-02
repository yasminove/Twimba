import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
const tweetBox = document.getElementById('tweet-box')
const feed = document.getElementById('feed')

let tweetsData = JSON.parse(localStorage.getItem('tweets')) || []

document.addEventListener('click', function (e) {
    if (e.target.id === "tweet-btn") {
        console.log(tweetBox.value, 'tweetBox');
        if (tweetBox.value !== '') {
            const obj = {
                handle: `@scrimba`,
                profilePic: `${"images/scrimbalogo.png"}`,
                likes: 0,
                retweets: 0,
                tweetText: `${tweetBox.value}`,
                replies: [],
                isLiked: false,
                isRetweeted: false,
                uuid: uuidv4()
            }
    
            tweetsData.unshift(obj)
            localStorage.setItem('tweets', JSON.stringify(tweetsData))
            tweetBox.value = ''
        }   
        renderTweets()
    }

    if (e.target.dataset.comment) {
        handleCommentClick(e.target.dataset.comment)
    }

    else if (e.target.dataset.heart) {
        handleHeartClick(e.target.dataset.heart)
    }

    else if (e.target.dataset.retweet) {
        handleRetweetClick(e.target.dataset.retweet)
    }
})

function handleCommentClick(id) {
    document.getElementById(`replies-${id}`).classList.toggle('hidden')
}

function handleHeartClick(id) {
    const targetTweet = tweetsData.filter(tweet => {
        return tweet.uuid === id
    })[0];
    if (targetTweet.isLiked) {
        targetTweet.likes--
        localStorage.setItem(`likes-${id}`, targetTweet.likes)
        
    } else {
        targetTweet.likes++
        localStorage.setItem(`likes-${id}`, targetTweet.likes)
    }

    targetTweet.isLiked = !targetTweet.isLiked;
    
   
    localStorage.setItem(`isLiked-${id}`, `${targetTweet.isLiked}`)


    renderTweets()
}

function handleRetweetClick(id) {
    const targetTweet = tweetsData.filter(tweet => {
        return tweet.uuid === id
    })[0]

    if (targetTweet.isRetweeted) {
        targetTweet.retweets--
        localStorage.setItem(`retweets-${id}`, targetTweet.retweets)
    } else {
        targetTweet.retweets++
        localStorage.setItem(`retweets-${id}`, targetTweet.retweets)
    }

    targetTweet.isRetweeted = !targetTweet.isRetweeted
    localStorage.setItem(`isRetweeted-${id}`, targetTweet.isRetweeted)
    console.log(localStorage.getItem(`isRetweeted-${id}`));
    renderTweets()
}

function renderTweets() {
    let html = ``
   
    tweetsData.forEach(tweet => {

        const storedIsLiked = localStorage.getItem(`isLiked-${tweet.uuid}`);
        const storedIsRetweeted = localStorage.getItem(`isRetweeted-${tweet.uuid}`)
        const storedLikes = parseInt(localStorage.getItem(`likes-${tweet.uuid}`)) || 0
        const storedRetweets = localStorage.getItem(`retweets-${tweet.uuid}`) || 0

        tweet.isLiked = storedIsLiked === 'true';
        tweet.isRetweeted = storedIsRetweeted === 'true';
        tweet.likes = storedLikes ? parseInt(storedLikes) : tweet.likes;
        tweet.retweets = storedRetweets ? parseInt(storedRetweets) : tweet.retweets;

        let likedClass = '';
        let retweetClass = '';
        
        if (localStorage.getItem(`isLiked-${tweet.uuid}`) === 'true') {
            likedClass = 'liked';
        }

        if (localStorage.getItem(`isRetweeted-${tweet.uuid}`) === 'true') {
            retweetClass = 'retweeted'
        }

        let replyHtml = ``;

        if (tweet.replies.length > 0) {
            
            tweet.replies.forEach(reply => {
                replyHtml += `
                <div class="tweet-reply">
                <div class="tweet-inner"> 
                    <img class="profile-pic" src="${reply.profilePic}" alt="">
                    <div>
                        <p class="handle">${reply.handle}</p>
                        <p class="tweet-text">${reply.tweetText}</p>
                    </div>
            </div>
            </div>
                `
            })
        }

        html += `
        <div class="tweet">
            <div class="tweet-inner">
                <img class="profile-pic" src="${tweet.profilePic}" alt="">
            <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"  data-comment=${tweet.uuid}></i>
                        ${tweet.replies.length} 
                </span>

                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likedClass}"  data-heart=${tweet.uuid}></i>
                        ${tweet.likes}
                </span>

                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetClass}" data-retweet=${tweet.uuid}></i>
                        ${tweet.retweets}
                </span>
                    
            </div>
                
        </div>
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                ${replyHtml}
            </div>
        </div>
    </div>`
    })

    feed.innerHTML = html
}

renderTweets()