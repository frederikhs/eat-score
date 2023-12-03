import React, {useEffect, useState} from 'react';
import {fetchAllItemsPaginated, Item} from "../request";
import ListItems from "../components/ListItems";
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Items() {
    const [items, setItems] = useState<Item[] | null>(null);
    const [pageNo, setPageNo] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const fetchData = () => {
        fetchAllItemsPaginated(pageNo).then((r) => {
            if (r.code === 200) {
                if (r.response.length === 0) {
                    setHasMore(false)
                    return
                }

                setItems((prevState) => {
                    if (prevState === null) {
                        return r.response
                    }

                    return [...prevState, ...r.response]
                })
                setPageNo((prev) => prev + 1)
            }
        })
    }

    useEffect(() => {
        fetchAllItemsPaginated(pageNo).then((r) => {
            if (r.code === 200) {
                setItems(r.response)
                setPageNo((prev) => prev + 1)
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const loading = <h1 className={"heading-default text-center mt-8"}>Loading...</h1>

    if (items === null) {
        return loading
    }

    return (
        <InfiniteScroll
            dataLength={items.length}
            next={fetchData}
            hasMore={hasMore}
            loader={loading}
        >
            <ListItems items={items} show_venue={true}/>
        </InfiniteScroll>
    );
}
