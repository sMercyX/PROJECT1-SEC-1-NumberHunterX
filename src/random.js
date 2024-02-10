const level = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const randomlv = []

const randomLevel = () => {
  let randomIndex
  while (randomlv.length < 5) {
    randomIndex = Math.floor(Math.random() * level.length)
    if (
      !randomlv.includes(level[randomIndex]) //หาตัวที่ยังไม่ถูกสุ่ม
    ) {
      randomlv.push(level[randomIndex])
    }
  }
}
