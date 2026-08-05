/**
 * Destiny Matrix core math — TypeScript port.
 * Adapted from /home/dmitry/Work/astral-day/utils/destiny-matrix/engine.ts,
 * itself adapted from destiny-matrix-core@0.1.1 (MIT).
 */

const assertInteger = (value: number, label: string): void => {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${label} must be a finite number`);
  }
  if (!Number.isInteger(value)) {
    throw new RangeError(`${label} must be an integer`);
  }
};

const daysInMonth = (year: number, month: number): number => {
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const monthLengths = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return monthLengths[month - 1];
};

export const assertDateParts = (day: number, month: number, year: number): void => {
  assertInteger(year, "year");
  if (year < 0) {
    throw new RangeError("year must be a non-negative integer");
  }
  assertInteger(month, "month");
  if (month < 1 || month > 12) {
    throw new RangeError("month must be between 1 and 12");
  }
  assertInteger(day, "day");
  const maxDay = daysInMonth(year, month);
  if (day < 1 || day > maxDay) {
    throw new RangeError(`day must be between 1 and ${maxDay}`);
  }
};

/** Fold a number into the 1–22 arcana range: above 22, sum its digits. */
export const reduceNumber = (value: number): number => {
  if (!Number.isFinite(value)) {
    throw new RangeError("number must be a finite number");
  }
  if (value > 22) {
    return (value % 10) + Math.floor(value / 10);
  }
  return value;
};

/** Digit-sum the year, then fold into 1–22. */
export const calculateYear = (year: number): number => {
  assertInteger(year, "year");
  if (year < 0) {
    throw new RangeError("year must be a non-negative integer");
  }
  let y = 0;
  let current = year;
  while (current > 0) {
    y += current % 10;
    current = Math.floor(current / 10);
  }
  return reduceNumber(y);
};

export interface MatrixPoints {
  apoint: number;
  bpoint: number;
  cpoint: number;
  dpoint: number;
  epoint: number;
  fpoint: number;
  gpoint: number;
  hpoint: number;
  ipoint: number;
  jpoint: number;
  kpoint: number;
  lpoint: number;
  mpoint: number;
  npoint: number;
  opoint: number;
  ppoint: number;
  qpoint: number;
  rpoint: number;
  spoint: number;
  tpoint: number;
  upoint: number;
  vpoint: number;
  wpoint: number;
  xpoint: number;
}

export interface MatrixPurposes {
  skypoint: number;
  earthpoint: number;
  perspurpose: number;
  femalepoint: number;
  malepoint: number;
  socialpurpose: number;
  generalpurpose: number;
  planetarypurpose: number;
}

/** Health map (chartHeart): physics / energy / emotions per chakra. */
export interface ChartHeart {
  sahphysics: number;
  ajphysics: number;
  vishphysics: number;
  anahphysics: number;
  manphysics: number;
  svadphysics: number;
  mulphysics: number;
  sahenergy: number;
  ajenergy: number;
  vishenergy: number;
  anahenergy: number;
  manenergy: number;
  svadenergy: number;
  mulenergy: number;
  sahemotions: number;
  ajemotions: number;
  vishemotions: number;
  anahemotions: number;
  manemotions: number;
  svademotions: number;
  mulemotions: number;
}

export interface MatrixResult {
  points: MatrixPoints;
  purposes: MatrixPurposes;
  chartHeart: ChartHeart;
}

export const calculateMatrixFromABC = (
  aPoint: number,
  bPoint: number,
  cPoint: number,
): MatrixResult => {
  assertInteger(aPoint, "aPoint");
  assertInteger(bPoint, "bPoint");
  assertInteger(cPoint, "cPoint");

  const dpoint = reduceNumber(aPoint + bPoint + cPoint);
  const epoint = reduceNumber(aPoint + bPoint + cPoint + dpoint);
  const fpoint = reduceNumber(aPoint + bPoint);
  const gpoint = reduceNumber(bPoint + cPoint);
  const hpoint = reduceNumber(dpoint + aPoint);
  const ipoint = reduceNumber(cPoint + dpoint);
  const jpoint = reduceNumber(dpoint + epoint);

  const npoint = reduceNumber(cPoint + epoint);
  const lpoint = reduceNumber(jpoint + npoint);
  const mpoint = reduceNumber(lpoint + npoint);
  const kpoint = reduceNumber(jpoint + lpoint);

  const qpoint = reduceNumber(npoint + cPoint);
  const rpoint = reduceNumber(jpoint + dpoint);
  const spoint = reduceNumber(aPoint + epoint);
  const tpoint = reduceNumber(bPoint + epoint);

  const opoint = reduceNumber(aPoint + spoint);
  const ppoint = reduceNumber(bPoint + tpoint);

  const upoint = reduceNumber(fpoint + gpoint + hpoint + ipoint);
  const vpoint = reduceNumber(epoint + upoint);
  const wpoint = reduceNumber(spoint + epoint);
  const xpoint = reduceNumber(tpoint + epoint);

  const skypoint = reduceNumber(bPoint + dpoint);
  const earthpoint = reduceNumber(aPoint + cPoint);
  const perspurpose = reduceNumber(skypoint + earthpoint);
  const femalepoint = reduceNumber(gpoint + hpoint);
  const malepoint = reduceNumber(fpoint + ipoint);
  const socialpurpose = reduceNumber(femalepoint + malepoint);
  const generalpurpose = reduceNumber(perspurpose + socialpurpose);
  const planetarypurpose = reduceNumber(socialpurpose + generalpurpose);

  const points: MatrixPoints = {
    apoint: aPoint,
    bpoint: bPoint,
    cpoint: cPoint,
    dpoint,
    epoint,
    fpoint,
    gpoint,
    hpoint,
    ipoint,
    jpoint,
    kpoint,
    lpoint,
    mpoint,
    npoint,
    opoint,
    ppoint,
    qpoint,
    rpoint,
    spoint,
    tpoint,
    upoint,
    vpoint,
    wpoint,
    xpoint,
  };

  const purposes: MatrixPurposes = {
    skypoint,
    earthpoint,
    perspurpose,
    femalepoint,
    malepoint,
    socialpurpose,
    generalpurpose,
    planetarypurpose,
  };

  const chartHeart: ChartHeart = {
    sahphysics: aPoint,
    ajphysics: opoint,
    vishphysics: spoint,
    anahphysics: wpoint,
    manphysics: epoint,
    svadphysics: jpoint,
    mulphysics: cPoint,

    sahenergy: bPoint,
    ajenergy: ppoint,
    vishenergy: tpoint,
    anahenergy: xpoint,
    manenergy: epoint,
    svadenergy: npoint,
    mulenergy: dpoint,

    sahemotions: reduceNumber(aPoint + bPoint),
    ajemotions: reduceNumber(opoint + ppoint),
    vishemotions: reduceNumber(spoint + tpoint),
    anahemotions: reduceNumber(wpoint + xpoint),
    manemotions: reduceNumber(epoint + epoint),
    svademotions: reduceNumber(jpoint + npoint),
    mulemotions: reduceNumber(cPoint + dpoint),
  };

  return { points, purposes, chartHeart };
};

export interface DestinyMatrix extends MatrixResult {
  inputs: {
    day: number;
    month: number;
    year: number;
    apoint: number;
    bpoint: number;
    cpoint: number;
  };
}

export const fromParts = (day: number, month: number, year: number): DestinyMatrix => {
  assertDateParts(day, month, year);
  const apoint = reduceNumber(day);
  const bpoint = month;
  const cpoint = calculateYear(year);
  const core = calculateMatrixFromABC(apoint, bpoint, cpoint);
  return {
    inputs: { day, month, year, apoint, bpoint, cpoint },
    ...core,
  };
};
