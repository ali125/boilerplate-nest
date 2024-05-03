import { Equal, ILike, Not } from 'typeorm';

export const filterControlOperator = (
  op: string,
  val: string | number,
): any => {
  switch (op) {
    case 'include':
      return ILike(`%${val}%`);
    case 'startWith':
      return ILike(`${val}%`);
    case 'endWith':
      return ILike(`%${val}`);
    case 'notEqual':
      return Not(val);
    case 'equal':
      return Equal(val);
  }
};
