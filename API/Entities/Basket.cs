namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItem> Items { get; set; } = new();

        public void AddItem(Product product, int quantity)
        {
            if (Items.All(item => item.ProductId != product.Id))
            {
                Items.Add(new BasketItem{Product = product, Quantity = quantity});
            }

            var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
            if (existingItem != null) existingItem.Quantity += quantity;
        }

        public void RemoveItem(int productId, int quantity) 
        {
            var removedItem = Items.FirstOrDefault(item => item.ProductId == productId);
            if (removedItem == null) return;
            removedItem.Quantity -= quantity;
            if (removedItem.Quantity == 0) Items.Remove(removedItem);
        }
    }
}