import React, {useEffect, useMemo, useState} from 'react';
import {useAccount} from "../Root";
import {fetchItemRatingAccountStatistic, ItemRatingAccountStatistic} from "../request";
import {firstWord} from "../util";
import RateSlider from "../components/RateSlider";

function minCountG(array: any[], key: string) {
    return Math.min(...array.map((stat) => stat[key]))
}

function maxCountG(array: any[], key: string) {
    return Math.max(...array.map((stat) => stat[key]))
}

export default function UsersPage() {
    const {account} = useAccount()
    const [itemRatingAccountStatistics, setItemRatingAccountStatistics] = useState<ItemRatingAccountStatistic[] | null>(null);

    useEffect(() => {
        fetchItemRatingAccountStatistic().then((r) => {
            setItemRatingAccountStatistics(r.response)
        })
    }, [])

    const statisticBoundaries = useMemo(() => {
        if (itemRatingAccountStatistics === null) {
            return null
        }

        return {
            count: {
                min: minCountG(itemRatingAccountStatistics, "count"),
                max: maxCountG(itemRatingAccountStatistics, "count")
            },
            avg: {
                min: minCountG(itemRatingAccountStatistics, "avg"),
                max: maxCountG(itemRatingAccountStatistics, "avg")
            },
            std_dev: {
                min: minCountG(itemRatingAccountStatistics, "std_dev"),
                max: maxCountG(itemRatingAccountStatistics, "std_dev")
            },
        }
    }, [itemRatingAccountStatistics])

    if (account === undefined) {
        return null
    }

    return (
        <div className={"box"}>
            {itemRatingAccountStatistics !== null && statisticBoundaries !== null &&
                <table className="w-full text-left dark:text-white table-fixed">
                    <thead>
                    <tr>
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Number of ratings</th>
                        <th className="px-3 py-2">Average rating</th>
                        <th className="px-3 py-2">Standard deviation</th>
                    </tr>
                    </thead>
                    <tbody>
                    {itemRatingAccountStatistics.map((stat, index) => {
                        return (
                            <tr key={index} className={"odd:bg-gray-100 dark:even:bg-neutral-800 even:bg-white dark:odd:bg-neutral-700"}>
                                <td className="px-3 py-2">{firstWord(stat.account_name)}</td>
                                <td className="px-3 py-2">
                                    <RateSlider
                                        value={stat.count}
                                        min={statisticBoundaries.count.min}
                                        max={statisticBoundaries.count.max}
                                        hideValue={false}
                                        disabled={true}
                                    />
                                </td>
                                <td className="px-3 py-2">
                                    <RateSlider
                                        value={stat.avg}
                                        min={statisticBoundaries.avg.min}
                                        max={statisticBoundaries.avg.max + 1}
                                        hideValue={false}
                                        disabled={true}
                                    />
                                </td>
                                <td className="px-3 py-2">
                                    <RateSlider
                                        value={stat.std_dev === null ? 0 : stat.std_dev}
                                        min={0}
                                        max={statisticBoundaries.std_dev.max + 1}
                                        hideValue={false}
                                        disabled={true}
                                    />
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            }
        </div>
    );
}
