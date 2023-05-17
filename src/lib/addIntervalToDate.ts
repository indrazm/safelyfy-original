interface intervalObject {
    date: Date
    intervalValue: number
    intervalType: string
}

export function addIntervalToDate({ date, intervalValue, intervalType }: intervalObject) {
    const newDate = new Date(date)

    switch (intervalType) {
        case "day":
            newDate.setDate(newDate.getDate() + intervalValue)
            break
        case "month":
            newDate.setMonth(newDate.getMonth() + intervalValue)
            break
        case "year":
            newDate.setFullYear(newDate.getFullYear() + intervalValue)
            break
        default:
            console.log("Invalid interval type")
    }

    return newDate
}
