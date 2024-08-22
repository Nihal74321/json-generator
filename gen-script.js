function GetLogX(x, n) {
    return Math.floor(Math.log(n) / Math.log(x))
}
function GetRand(container) {
    return Math.floor(Math.random() * container.length) 
}
async function GetObjects(){
    const [dogs, humans, walk_notes, breeds, date_time] = await Promise.all([
        fetch("./dogs.json"),
        fetch("./humans.json"),
        fetch("./walker_notes.json"),
        fetch("./breeds.json"),
        fetch("./dates-times.json"),
    ])

    const dog_response = await dogs.json()
    const humans_response = await humans.json()
    const w_n_response = await walk_notes.json()
    const breed_response = await breeds.json()
    const d_t_response = await date_time.json()

    return [dog_response, humans_response, w_n_response, breed_response, d_t_response]
}

async function PairDogs() {
    let dog_entity = {
        owner : {}
    }
    return GetObjects().then(([d,h,w,b,d_t]) => {
        let seed_d = GetRand(d)
        let seed_h = GetRand(h)
        let seed_b = GetRand(b)

        dog_entity.id = crypto.randomUUID()
        dog_entity.name = d[seed_d].name
        dog_entity.gender = d[seed_d].gender
        dog_entity.breed = b[seed_b].breed_name
        dog_entity.owner = {user_id: crypto.randomUUID(), first_name: h[seed_h].first_name, last_name: h[seed_h].last_name, gender: h[seed_h].gender, email: h[seed_h].email, mb_number: h[seed_h].mobile_number, payment_method: h[seed_h].payment_method}

        return dog_entity
    })
}

async function PairedDogArray(count) {
    let arr = []
    for(let i =  0; i < count; i++) {
        const ent = await PairDogs()
        arr.push(ent)
    }
    return arr
}

async function PairWalker() {
    let walker = {}
    return GetObjects().then(([d,h,w,b,d_t]) => {
        let seed_name = GetRand(h)
        walker.user_id = crypto.randomUUID()
        walker.first_name = h[seed_name].first_name
        walker.last_name = h[seed_name].last_name
        walker.mobile_number = h[seed_name].mobile_number
        
        return walker
    })
}

async function PairedWalkerArray(count) {
    let arr = []
    for(let i =  0; i < count; i++) {
        const ent = await PairWalker()
        arr.push(ent)
    }
    return arr
}

async function ParseEnt(dog_arr, walker_arr) {
    let booked_walk = {
        walker: {},
        dog: {}
    }
    return GetObjects().then(([d,h,w,b,d_t]) => {
        let seed_d = GetRand(d_t)
        let seed_dog = GetRand(dog_arr)
        let seed_w = GetRand(walker_arr)
        let seed_w_n = GetRand(w)

        booked_walk.transaction_id = crypto.randomUUID()
        booked_walk.walker = {id: walker_arr[seed_w].user_id,first_name: walker_arr[seed_w].first_name, last_name: walker_arr[seed_w].last_name, mobile_number: walker_arr[seed_w].mobile_number}
        booked_walk.notes = w[seed_w_n].note
        booked_walk.date = d_t[seed_d].date
        booked_walk.time = d_t[seed_d].time
        booked_walk.dog = {
            id: dog_arr[seed_dog].id,
            name: dog_arr[seed_dog].name,
            gender: dog_arr[seed_dog].gender,
            breed: dog_arr[seed_dog].breed,
            owner: {
                user_id: dog_arr[seed_dog].owner.user_id,
                first_name: dog_arr[seed_dog].owner.first_name,
                last_name: dog_arr[seed_dog].owner.last_name,
                gender: dog_arr[seed_dog].owner.gender,
                email: dog_arr[seed_dog].owner.email,
                mobile_number: dog_arr[seed_dog].owner.mb_number,
                payment_method: dog_arr[seed_dog].owner.payment_method   
            }
        }
        return booked_walk
    })
}
async function GenerateJsonArray(seed_count) {
    let arr = []
    let dog_arr = await PairedDogArray(GetLogX(3, seed_count))
    let walker_arr = await PairedWalkerArray(GetLogX(2, seed_count))

    for(let i = 0; i < seed_count; i++) {
        const ent = await ParseEnt(dog_arr, walker_arr)
        arr.push(ent)
    }
    const data_str = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(arr, null, 2))
    const a = document.createElement('a')
    a.setAttribute("href", data_str)
    a.setAttribute("download", "test-system.json")
    a.click()
}

GenerateJsonArray(30)