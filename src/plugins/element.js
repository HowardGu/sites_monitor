import Vue from 'vue'
import {
    Aside,
    Button,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Col,
    Container,
    DatePicker,
    Dialog,
    Header,
    Form,
    FormItem,
    Footer,
    Input,
    InputNumber,
    Main,
    Message,
    MessageBox,
    Menu,
    MenuItem,
    Option,
    Pagination,
    Row,
    Select,
    Table,
    TableColumn,
    Tooltip,
    Tree
} from 'element-ui'

Vue.use(Button)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Footer)
Vue.use(Input)
Vue.use(Container)
Vue.use(Dialog)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tooltip)
Vue.use(Option)
Vue.use(Select)
Vue.use(Row)
Vue.use(Col)
Vue.use(InputNumber)
Vue.use(DatePicker)
Vue.use(Pagination)
Vue.use(Tree)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
