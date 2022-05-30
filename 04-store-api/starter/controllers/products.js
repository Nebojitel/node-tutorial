const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  //Сортировка в обратную сторону по имени и по увеличению цены
  // const products = await Product.find({}).sort('-name price');

  //Цена больше чем 30, выборка только по name и price, сортировка по name, ограничить 10 элементами и пропустить первые 5
  const products = await Product.find({ price: { $gt: 30 } })
    .sort('name')
    .select('name price')
    .limit(10)
    .skip(5);

  //Использование модуля async errors
  // throw new Error('testing async errors');

  //Простой поиск объектов по имени
  // const search = 'ab';
  // const products = await Product.find({
  // featured: true,
  // name: { $regex: search, $options: 'i' },
  // });
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }

  //Конвертация из символов слева в объекте в понятные для мангуса команды. Например превратить price>30,rating>=4 в { price: { '$gt': 30 }, rating: { '$gte': 4 } }
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  console.log(queryObject);
  let result = Product.find(queryObject);
  //sort
  if (sort) {
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    result = result.sort('createdAt');
  }
  //select
  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }

  //Отображение по умолчанию первой страницы из 10 элементов
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
