
export const dateTranslate = (string) => {
    return string.replace(
        "just now","biraz önce").replace(
        "ago","önce").replace(
        "seconds","saniye").replace(
        "second","saniye").replace(
        "minutes","dakika").replace(
        "minute","dakika").replace(
        "hours","saat").replace(
        "hour","saat").replace(
        "days","gün").replace(
        "day","gün").replace(
        "weeks","hafta").replace(
        "week","hafta")
}