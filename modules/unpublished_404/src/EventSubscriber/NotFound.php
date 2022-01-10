<?php

namespace Drupal\unpublished_404\EventSubscriber;

use Drupal\Core\EventSubscriber\HttpExceptionSubscriberBase;
use Symfony\Component\HttpKernel\Event\GetResponseForExceptionEvent;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class NotFound extends HttpExceptionSubscriberBase {

  protected static function getPriority() {
    return 1000;
  }

  protected function getHandledFormats() {
    return ['html'];
  }

  public function on403(GetResponseForExceptionEvent $event) {
    $request = $event->getRequest();
 
    if ($node = $request->attributes->get('node')) {
      if (!$node->isPublished()) {
        $event->setException(new NotFoundHttpException());
      }
    }
  }
}
