interface ApiResponse {
    response: any
    code: number
}

const BASE_API_URI = process.env.REACT_APP_BASE_API_URI as string

const postJson = async (uri: string, body?: object): Promise<ApiResponse> => {
    const response = await fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: "include",
    })

    return {
        response: await response.json(),
        code: response.status
    }
}

const getJson = async (uri: string): Promise<ApiResponse> => {
    const response = await fetch(uri, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
    })


    return {
        response: await response.json(),
        code: response.status
    }
}

export interface Account {
    account_id: number
    account_email: string
    account_name: string
}

export const AccountInfo = async (): Promise<ApiResponse> => {
    return await getJson(`${BASE_API_URI}/me`)
}

export const requestMagicLoginLink = async (email: string): Promise<ApiResponse> => {
    return await postJson(`${BASE_API_URI}/login/request`, {email})
}

export const loginWithMagicLoginLink = async (magic_login_link_hash: string): Promise<ApiResponse> => {
    return await postJson(`${BASE_API_URI}/login`, {magic_login_link_hash})
}

export const logout = async (): Promise<ApiResponse> => {
    return await postJson(`${BASE_API_URI}/logout`)
}

export interface Item {
    item_id: number
    venue_id: number
    venue_name: string
    item_name: string
    item_price_dkk: number
    avg_item_rating_value: number | null
}

export const fetchAllItems = async (): Promise<ApiResponse> => {
    return await getJson(`${BASE_API_URI}/items`)
}

export const fetchItemsByVenueId = async (venue_id: number): Promise<ApiResponse> => {
    return await getJson(`${BASE_API_URI}/venues/${venue_id}/items`)
}

export const fetchItemByVenueIdAndItemId = async (venue_id: number, item_id: number): Promise<ApiResponse> => {
    return await getJson(`${BASE_API_URI}/venues/${venue_id}/items/${item_id}`)
}

export interface Venue {
    venue_id: number
    venue_name: string
    avg_venue_rating_value: number
}

export const fetchAllVenues = async (): Promise<ApiResponse> => {
    return await getJson(`${BASE_API_URI}/venues`)
}

export const fetchVenueById = async (venue_id: number): Promise<ApiResponse> => {
    return await getJson(`${BASE_API_URI}/venues/${venue_id}`)
}

export interface ItemRating {
    item_rating_id: number
    item_id: number
    item_name: string
    venue_id: number
    venue_name: string
    item_rating_value: number
    account_id: number
    account_name: string
}

export const fetchItemRatingsByVenueIdAndItemId = async (venue_id: number, item_id: number): Promise<ApiResponse> => {
    return await getJson(`${BASE_API_URI}/venues/${venue_id}/items/${item_id}/ratings`)
}

export const createItemRating = async (venue_id: number, item_id: number, value: number): Promise<ApiResponse> => {
    return await postJson(`${BASE_API_URI}/venues/${venue_id}/items/${item_id}/ratings`, {value})
}
