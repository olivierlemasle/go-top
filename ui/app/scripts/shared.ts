"use strict";

module uiApp {
  "use strict";

  export class Serie {
    label: string;
    values: Point[];
  }

  export class Point {
    time: number;
    y: number;

    constructor(time: moment.Moment, y: number) {
      this.time = time.unix();
      this.y = y;
    }
  }

  export class PieShare {
    label: string;
    value: number;

    constructor(label: string, value: number) {
      this.label = label;
      this.value = value;
    }
  }

}
