// write your code here

let likesText = document.querySelector('#like-count')

let commentList = document.querySelector('#comments-list')

document.addEventListener('DOMContentLoaded',()=>{

    // console.log("dom content ")

    fetch("http://localhost:3000/images/1")
    .then((res)=>res.json())
    .then((res)=>{
        console.log(res)
        let img = res

       //console.log(images)

        // images.forEach((img,index)=>{

        let imgTitle = document.querySelector('#card-title')

        let imgElement = document.querySelector('#card-image')
                
        imgTitle.innerHTML = img.title

        likesText.innerHTML = `${img.likes} likes`

        imgElement.setAttribute('src', `${img.image}`)


        let likeButton = document.querySelector('#like-button')

        likeButton.setAttribute('name', `${img.id}`)            

        likeButton.addEventListener('click', handleLike)
    })



    fetch("http://localhost:3000/images/1/comments")
    .then((res)=> res.json())
    .then((comments)=>{

        

        let commentNodes = []

        comments.forEach((comment, indx)=>{
            let li = document.createElement('li')

            li.textContent = comment.content 

            commentNodes.push(li)
        })
        commentList.replaceChildren(...commentNodes)
    })

    const inputForm = document.querySelector('#comment-form')

    inputForm.addEventListener('submit', addComment)
})


function addComment(event){
    event.preventDefault()

    const input = document.querySelector('#comment')

    console.log(input.value)

    postComment(input.value).then((res)=>{
        console.log("post comment")
        //console.log(res)
        return res.json()
    }).then((res)=>{
        console.log(res)

        //update comment section

        let li = document.createElement('li')

        li.textContent = res.content

        commentList.appendChild(li)

        input.value = ""
    })

}

async function postComment(data){

    let comment = {       
        "imageId": 1, 
        "content": data
    }

    let configObj  = {        
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(comment),                
    }

    return await fetch(`http://localhost:3000/images/1/comments/`, configObj)

}


let getImageById = async (id)=>{
    return await fetch(`http://localhost:3000/images/${id}`)
    .then((res)=>res.json())
    .then(async (res)=>{

        return res
    })
}

let updateLike = async (post, id)=>{

    let configObj  = {        
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(post),                
    }

    let obj =  await fetch(`http://localhost:3000/images/${id}`, configObj)
        .then((res)=> res.json())
        .then((res)=>{
            return res
        }
    )

    return obj
}


async function handleLike(event) {
        //event.preventDefault()
        // get number of likes

        let id = event.target.getAttribute('name')

        console.log(id)
        // let likes

        console.log("some likes")

        let obj = await getImageById(id).then((res)=>{

            console.log("res", res)

            let likes = res.likes + 1

            res.likes = likes
            return res
        })

        updateLike(obj, id).then((res)=>{
            console.log("updated,", res)

            likesText.innerHTML = `${res.likes} likes`
        })

        console.log("obj", obj)            
       // update(obj, name)
        // console.log("x", x)
}

