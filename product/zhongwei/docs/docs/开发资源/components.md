# 公共组件文档 Components



### moblie

moblie公共组件说明

#### 图片组件 - IconSvg
样式在设置 `styles/_icon.scss` 文件中

传入的path是在`images`文件夹中命名的`svg`文件, 生成 class 名称（svg 中下划线会替换为 中横线）

```typescript
  interface IIconSvg {
    path: string; // 引入名称
  }
```


<code  src="../components-demo/search-icon.tsx"></code>

#### 卡片组件 - BasicCard

```typescript
interface IBasicCard {
    className?: string;
    children: React.ReactNode;
}
```
<code src="../components-demo/basic-card.tsx"></code>


#### mpa

​	mpa组件说明

#### spa

​	spa组件说明

### pc

moblie公共组件说明

#### mpa

​	mpa组件说明

#### spa

​	spa组件说明
