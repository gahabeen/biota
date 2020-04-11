function PageInstance(page: object) {
  this.value = page;
  return this;
}

PageInstance.prototype.data = function () {
  return this.value.data;
};

export async function Page(cursor: AsyncIterator<any>) {
  return cursor.next().then(({ value }) => {
    if (!value) {
      return { data: [] };
    } else {
      return value;
    }
  });
}
