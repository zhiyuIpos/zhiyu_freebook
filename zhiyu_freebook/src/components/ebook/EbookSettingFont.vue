<template>
<transition name="slide-up">
<div class="setting-wrapper" 
    v-show="menuVisible && settingVisible === 0">
    <div class="setting-font-size">
        <div class="preview" 
        :style="{fontSize:fontSizeList[0].fontSize + 'px'}">A</div>
        <div class="select">
            <div class="select-wrapper" 
            v-for="(item,index) in fontSizeList" 
            :key="index"
            @click="setFontSize(item.fontSize)">
                <div class="line"></div>
                <div class="point-wrapper">
                    <div class="point" v-show="defaultFontSize === item.fontSize">
                        <div class="small-point">
                        </div>
                    </div>
                </div>
                <div class="line"></div>
            </div>
        </div>
        <div class="preview" 
        :style="{fontSize:fontSizeList[fontSizeList.length - 1].fontSize + 'px'}">A</div>
    </div>
    <div class="setting-font-family" @click="showFontFamilyPopup">
        <div class="setting-font-family-text-wrapper">
            <span class="setting-font-family-text">{{defaultFontFamily}}</span>
        </div>
        <div class="setting-font-family-icon-wrapper">
            <span class="icon-forward">

            </span>
        </div>
    </div>
</div> 
</transition>
</template>

<script>
import {FONT_SIZE_LIST} from '../../utils/book'
import { ebookMixin } from '../../utils/mixin'
import { saveFontSize } from '../../utils/localStorage'
export default {
    mixins:[ebookMixin],
    data (){
        return{
            fontSizeList : FONT_SIZE_LIST
        }
    },
    methods:{
        // 
        showFontFamilyPopup(){
            // 设置字体设置弹出
            this.setFontFamilyVisible(true)
        },
        setFontSize(fontSize){
            // 设置默认字号
            this.setDefaultFontSize(fontSize)
            // 保存字号
            saveFontSize(this.fileName, fontSize)
            // 通过rendition.themes方法修改字体的字号
            this.currentBook.rendition.themes.fontSize(fontSize)
        }
    }
}
</script>
<style lang='scss' scoped>
@import '../../assets/styles/global';
.setting-wrapper{
        position: absolute;
        bottom: px2rem(48);
        z-index: 151;
        left :0;
        width: 100%;
        display: flex;
        flex-direction : column;
        height: px2rem(90);
        box-shadow:0 px2rem(-8) px2rem(8) rgba(0,0,0,.15);
        background:#fff;
        .setting-font-size{
            flex: 2;
            display:flex;
            height: 100%;
            .preview{
                flex:0 0 px2rem(40);
                @include center;
            }
            .select{
                display: flex;
                flex:1;
                .select-wrapper{
                flex : 1;
                display: flex;
                align-items:center;
                &:first-child{
                    .line{
                        &:first-child{
                            border-top: none;
                        }
                    }
                }
                &:last-child{
                    .line{
                        &:last-child{
                            border-top: none;
                        }
                    }
                }
                .line{
                    flex :1;
                    height: 0;
                    border-top: 1px solid #ccc;
                }
                .point-wrapper{
                    position:relative;
                    flex: 0 0 0 ;
                    width: 0;
                    height: px2rem(7);
                    border-left: px2rem(1) solid #ccc;
                    .point{
                        position:absolute;
                        top:px2rem(-8);
                        left:px2rem(-10);
                        width:px2rem(20);
                        height:px2rem(20);
                        border-radius: 50%;
                        background:white;
                        border:px2rem(1) solid #ccc;
                        box-shadow: 0 px2rem(4) px2rem(4) rgba(0,0,0,.15);
                        @include center;
                        .small-point{
                            width: px2rem(5);
                            height: px2rem(5);
                            border-radius:50%;
                            background:#000;
                        }
                    }
                }
            }
            }  
        } 
        .setting-font-family{
            flex:1;
            font-size:px2rem(14);
            @include center;
            .setting-font-family-text-wrapper{
                // 文本
                @include center;
            }
            .setting-font-family-icon-wrapper{
                @include center;
            }
        }
}
</style>