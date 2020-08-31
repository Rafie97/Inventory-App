class Item {
    constructor(docID, name, price, imageLink, barcode, promo, reviews, priceHistory){
        this.docID = docID;
        this.name = name;
        this.price = price;
        this.imageLink = imageLink;
        this.barcode = barcode;
        this.promo = promo;
        this.reviews = reviews;
        this.priceHistory = priceHistory
    }

    toString(){
        return this.docID + ',' + this.name + ',' + this.price + ',' + this.imageLink + ',' + this.barcode + ',' + this.promo + ',' + this.reviews + ',' + this.priceHistory;
    }

}

export default Item;