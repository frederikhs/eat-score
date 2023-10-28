export default function Version() {
    return (
        <div className={"m-4 text-neutral-400"}>
            <div className={'font-medium text-center'}>
                This site was created by <a target="_blank" rel="noreferrer" href="https://github.com/frederikhs" className="underline">frederikhs</a>.
                View on <a target="_blank" rel="noreferrer" href="https://github.com/frederikhs/eat-score" className="underline">GitHub</a>
            </div>
            <div className={'font-medium text-center'}>
                {process.env.REACT_APP_VERSION}
            </div>
        </div>
    )
}
