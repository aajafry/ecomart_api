function calculateDiscount (items, coupon) {
    if(!coupon) return 0;

    return items.reduce((total, item) => {
        const { name, price, quantity } = item;
        const { selectedProduct, discountType, discount } = coupon;

        if(selectedProduct.includes(name)) {
            let discountAmount;
            switch (discountType) {
                case "fixed":
                discountAmount = discount * quantity;
                break;
                case "percentage":
                discountAmount = (price * quantity * discount) / 100;
                break;
                default:
                discountAmount = 0;
                break;
            }
            return total + discountAmount;
        }
        return total
    }, 0)
}


module.exports = calculateDiscount