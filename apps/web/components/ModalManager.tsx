'use client';

import { useModal } from '@/contexts/AppContext';
import { Modal } from '@ui';

// Import future modal components here
// import { ProjectModal } from './modals/ProjectModal';
// import { TaskModal } from './modals/TaskModal';
// import { EventModal } from './modals/EventModal';

export function ModalManager() {
    const { modal, closeModal } = useModal();

    if (!modal || !modal.isOpen) {
        return null;
    }

    const renderModalContent = () => {
        switch (modal.type) {
            case 'project':
                // return <ProjectModal {...modal.props} />;
                return <div>Project Modal (to be implemented)</div>;

            case 'task':
                // return <TaskModal {...modal.props} />;
                return <div>Task Modal (to be implemented)</div>;

            case 'event':
                // return <EventModal {...modal.props} />;
                return <div>Event Modal (to be implemented)</div>;

            case 'confirmation':
                return (
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {modal.props?.title || 'Confirm Action'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {modal.props?.message || 'Are you sure you want to proceed?'}
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    modal.props?.onConfirm?.();
                                    closeModal();
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                {modal.props?.confirmText || 'Confirm'}
                            </button>
                        </div>
                    </div>
                );

            default:
                return <div>Unknown modal type: {modal.type}</div>;
        }
    };

    return (
        <Modal
            isOpen={modal.isOpen}
            onClose={closeModal}
            title={modal.props?.title}
            size={modal.props?.size || 'md'}
        >
            {renderModalContent()}
        </Modal>
    );
} 