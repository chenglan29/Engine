prompt = (tip, defaultValue = '', isMultiline = false) => {
    // 返回Promise，方便异步处理确认/取消操作
    return new Promise((resolve) => {
        // 1. 检查是否已存在弹窗，存在则先移除（避免重复创建）
        const oldOverlay = document.querySelector('.win-overlay');
        if (oldOverlay) {
            oldOverlay.remove();
        }

        // 2. 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'win-overlay';

        // 3. 创建弹窗容器
        const modal = document.createElement('div');
        modal.className = 'win-modal';

        // 4. 创建提示文本
        const tipElement = document.createElement('p');
        tipElement.className = 'win-tip';
        tipElement.textContent = tip;
        modal.appendChild(tipElement);

        // 5. 根据是否换行创建输入框/文本域
        let inputElement;
        if (isMultiline) {
            inputElement = document.createElement('textarea');
            inputElement.className = 'win-textarea';
        } else {
            inputElement = document.createElement('input');
            inputElement.className = 'win-input';
            inputElement.type = 'text';
        }
        // 设置初始记忆值
        inputElement.value = defaultValue;
        modal.appendChild(inputElement);

        // 6. 创建按钮容器
        const buttons = document.createElement('div');
        buttons.className = 'win-buttons';

        // 取消按钮
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'win-btn win-cancel';
        cancelBtn.textContent = '取消';
        cancelBtn.onclick = () => {
            overlay.remove(); // 移除弹窗
            resolve(null); // 取消返回null
        };

        // 确认按钮
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'win-btn win-confirm';
        confirmBtn.textContent = '确认';
        confirmBtn.onclick = () => {
            const inputValue = inputElement.value.trim();
            overlay.remove(); // 移除弹窗
            resolve(inputValue); // 确认返回输入值
        };

        buttons.appendChild(cancelBtn);
        buttons.appendChild(confirmBtn);
        modal.appendChild(buttons);
        overlay.appendChild(modal);

        // 7. 点击遮罩层取消弹窗
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
                resolve(null);
            }
        };

        // 8. 将弹窗添加到页面
        document.body.appendChild(overlay);

        // 9. 自动聚焦输入框
        inputElement.focus();
    });
}