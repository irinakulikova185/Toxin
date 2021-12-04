import './styles/index.scss';
import './index.pug';
import './pages/UIKit/colors-type/colors-type.pug'

const userStack = {
    language: 'JavaScript',
    framework: 'Angular'
}

const user = {
    name: 'Vitalij',
    age: '37',
    ...userStack
}

console.log(user)