interface ApiResponse {
    response: any
    code: number
}

const BASE_API_URI = process.env.REACT_APP_BASE_API_URI as string

const RequestWithJsonBody = async (method: string, uri: string, body?: object): Promise<ApiResponse> => {
    const response = await fetch(uri, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: "include",
    })

    let json
    try {
        json = await response.json()
    } catch (e) {
    }

    return {
        response: json,
        code: response.status
    }
}

const postJson = async (uri: string, body?: object): Promise<ApiResponse> => {
    return RequestWithJsonBody('POST', uri, body)
}

const deleteJson = async (uri: string, body?: object): Promise<ApiResponse> => {
    return RequestWithJsonBody('DELETE', uri, body)
}

const getJson = async (uri: string): Promise<ApiResponse> => {
    const response = await fetch(uri, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
    })

    let json
    try {
        json = await response.json()
    } catch (e) {
    }

    return {
        response: json,
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

export const logoutOther = async (): Promise<ApiResponse> => {
    return await postJson(`${BASE_API_URI}/logout-other`)
}

export interface Item {
    item_id: number
    venue_id: number
    venue_name: string
    item_name: string
    item_price_dkk: number
    item_created_by_account_id: number
    item_created_by_account_name: string
    item_created_at: string
    avg_item_rating_value: number | null
    item_rating_count: number
    min_item_rating_value: number | null
    max_item_rating_value: number | null
    standard_deviation_item_rating_value: number | null
    has_rated_item: boolean
}

export const fetchAllItems = async (): Promise<ApiResponse> => {
    return await getJson(`${BASE_API_URI}/items`)
}

export const fetchAllItemsPaginated = async (page_no: number): Promise<ApiResponse> => {
    return await getJson(`${BASE_API_URI}/items/paginated?page_no=${page_no}`)
}

export const createItem = async (item_venue_id: number, item_name: string, item_price_dkk: number): Promise<ApiResponse> => {
    return await postJson(`${BASE_API_URI}/venues/${item_venue_id}/items`, {item_name, item_price_dkk})
}

export const deleteItem = async (venue_id: number, item_id: number): Promise<ApiResponse> => {
    return await deleteJson(`${BASE_API_URI}/venues/${venue_id}/items/${item_id}`)
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
    venue_created_by_account_id: number
    venue_created_by_account_name: string
}

export const fetchAllVenues = async (): Promise<ApiResponse> => {
    return await getJson(`${BASE_API_URI}/venues`)
}

export const fetchVenueById = async (venue_id: number): Promise<ApiResponse> => {
    return await getJson(`${BASE_API_URI}/venues/${venue_id}`)
}

export const createVenue = async (venue_name: string): Promise<ApiResponse> => {
    return await postJson(`${BASE_API_URI}/venues`, {venue_name})
}

export const deleteVenue = async (venue_id: number): Promise<ApiResponse> => {
    return await deleteJson(`${BASE_API_URI}/venues/${venue_id}`)
}

export interface ItemRating {
    item_rating_id: number
    item_id: number
    item_name: string
    venue_id: number
    venue_name: string
    item_rating_value: number
    item_rating_created_at: string
    item_rating_account_id: number
    item_rating_account_name: string
}

export const fetchItemRatingsByVenueIdAndItemId = async (venue_id: number, item_id: number): Promise<ApiResponse> => {
    return await getJson(`${BASE_API_URI}/venues/${venue_id}/items/${item_id}/ratings`)
}

export const createItemRating = async (venue_id: number, item_id: number, value: number): Promise<ApiResponse> => {
    return await postJson(`${BASE_API_URI}/venues/${venue_id}/items/${item_id}/ratings`, {value})
}

export interface ItemRatingAccountStatistic {
    account_id: number
    account_name: string
    count: number
    avg: number
    std_dev: number|null
}

export const fetchItemRatingAccountStatistic = async (): Promise<ApiResponse> => {
    return await getJson(`${BASE_API_URI}/accounts/item-rating-statistics`)
}
