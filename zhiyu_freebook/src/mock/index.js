import Mock from 'mockjs'
import BookHomeApi from './bookHome'
// 书架
import BookShelfApi from './bookShelf'
// 所有图书列表
import BookHomeList from './bookList'
// 查询用
import BookFlatList from './bookFlatList'

// Mock.setup({
//   timeout: '350-600'
// })

Mock.mock(/\/book\/home/, 'get', BookHomeApi)
Mock.mock(/\/book\/shelf/, 'get', BookShelfApi)
Mock.mock(/\/book\/list/, 'get', BookHomeList)
Mock.mock(/\/book\/flat-list/, 'get', BookFlatList)

export default Mock
