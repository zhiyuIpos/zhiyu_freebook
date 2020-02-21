<template>
 <div class="shelf-item"
        :class="{'shelf-item-shadow':data.type===1 || data.type==2}" 
        @click="onItemClick"
        >
    <component :is="item" 
                :data="data"
                class="shelf-item-comp"
                :class="{'is-edit':isEditMode && data.type == 2}"></component>
    <div class="icon-selected"
        v-show="isEditMode && data.type===1"
        :class="{'is-selected':data.selected}">
    </div>
 </div>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixin'
import ShelfItemBook from './ShelfItemBook'
import ShelfItemCategory from './ShelfItemCategory'
import ShelfAdd from './ShelfAdd'
import {gotoStoreHome} from  '../../utils/store'
export default {
    mixins:[storeShelfMixin],
    props:{
        data:Object
    },
    data(){
        return{
            book:ShelfItemBook,
            category:ShelfItemCategory,
            add:ShelfAdd,
        }
    },
    methods:{
        onItemClick(){
            // 是编辑状态的时候
            if(this.isEditMode && this.data.type!==3){
                // 取反
                this.data.selected=!this.data.selected
                if(this.data.selected){
                    this.shelfSelected.pushWithoutDuplicate(this.data)
                }else{
                    this.setShelfSelected(this.shelfSelected.filter(item=>item.id!==this.data.id))
                }
            }else{
                // 不是编辑的时候
                if(this.data.type===1){
                    // 表示详情
                    this.showBookDetail(this.data)
                }else if(this.data.type===2){
                    // 
                    this.$router.push({
                        path:'/store/category',
                        query:{
                            title:this.data.title
                        }
                    })
                }else{
                    // data.type ===3 去书城首页
                    if(!this.isEditMode){
                        gotoStoreHome(this)
                    }
                }
            }
        }
    },
    computed:{
        item(){
            return this.data.type===1 ?this.book : (this.data.type===2 ? this.category:this.add)
        }
    }
}
</script>
<style lang='scss' rel="stylesheet/scss" scoped>
@import '../../assets/styles/global';
.shelf-item{
    position: relative;
    height: 100%;
    width: 100%;
    &.shelf-item-shadow{
        box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200,200,200,.3);
    }
    .shelf-item-comp{
        opacity: 1;
        &.is-edit{
            opacity: .3;
        }
    }
    .icon-selected{
        position: absolute;
        bottom:px2rem(2);
        right:px2rem(2);
        font-size:px2rem(18);
        color:rgba(0,0,0,.4);
        &.is-selected{
            color: blue;
        }
    }
}
</style>