import firebase from "firebase/compat/app";

type TDate = {
  year: number;
  month: number;
  day: number;
}

export const getDate = (datetime: firebase.firestore.Timestamp) => {
  const date = datetime.toDate();

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  };
};

export const formatDate = (date: TDate) => {
  const year = date.year;
  const month = String(date.month).padStart(2, '0');
  const day = String(date.day).padStart(2, '0');

  return `${year}년 ${month}월 ${day}일`;
};